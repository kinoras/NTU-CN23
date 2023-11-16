#include <iostream>
#include <string>
#include <vector>
#include <cstring>
#include <cstdlib>
#include <cstdio>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/epoll.h>
#include <fcntl.h>
#include <queue>

#include "server.h"

int main(int argc, char** argv) {
    // Check arguments
    if (argc != 2) {
        ERR_EXIT("usage: [port]");
    }

    ushort PORT = atoi(argv[1]);

    // Setup socket fd
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        ERR_EXIT("socket");
    }

    // Setup socker address
    sockaddr_in server_address;
    bzero(&server_address, sizeof(server_address));
    server_address.sin_family = AF_INET;
    server_address.sin_port = htons(PORT);
    server_address.sin_addr.s_addr = htonl(INADDR_ANY);

    // Setup client address, used by accept()
    sockaddr_in client_address;

    // Bind server address and port
    if (bind(server_socket, (struct sockaddr*)&server_address, sizeof(server_address)) < 0) {
        ERR_EXIT("bind");
    }

    if (listen(server_socket, 1024) < 0) {
        ERR_EXIT("listen");
    }

    // Create epoll instance
    int epoll_fd = epoll_create1(0);
    if (epoll_fd == -1) {
        ERR_EXIT("epoll");
    }

    struct epoll_event event;
    event.events = EPOLLIN;
    event.data.fd = server_socket;

    if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, server_socket, &event) == -1) {
        ERR_EXIT("epoll_ctl");
    }

    std::vector<struct epoll_event> events(MAX_EVENTS);

    fprintf(stderr, "starting on port %d, fd %d, maxconn %d...\n", PORT, server_socket, MAX_EVENTS);

#ifdef PHASE_1
    std::map<std::string, std::queue<std::string>> mailbox;
#endif

    while (true) {
        int num_events = epoll_wait(epoll_fd, events.data(), MAX_EVENTS, -1);
        for (int i = 0; i < num_events; i++) {
            if (events[i].data.fd == server_socket) {
                int client_length = sizeof(client_address);
                int client_socket = accept(server_socket, (struct sockaddr*)&client_address, (socklen_t *) &client_length);

                if (client_socket < 0) {
                    if (errno == EINTR || errno == EAGAIN)
                        continue;
                    if (errno == ENFILE) {
                        (void)fprintf(stderr, "out of file descriptor table ... (maxconn %d)\n", MAX_EVENTS);
                        continue;
                    }
                    ERR_EXIT("accept");
                }

                // Set the client socket as non-blocking
                int flags = fcntl(client_socket, F_GETFL, 0);
                fcntl(client_socket, F_SETFL, flags | O_NONBLOCK);

                fprintf(stderr, "getting a new request... fd %d from %s\n", client_socket, inet_ntoa(client_address.sin_addr));

                struct epoll_event client_event;
                client_event.events = EPOLLIN | EPOLLET;
                client_event.data.fd = client_socket;

                epoll_ctl(epoll_fd, EPOLL_CTL_ADD, client_socket, &client_event);
            } else {
                int client_socket = events[i].data.fd;
                char buffer[4096];
                int bytes_received = recv(client_socket, buffer, sizeof(buffer), 0);
                if (bytes_received <= 0) {
                    close(client_socket);
                    epoll_ctl(epoll_fd, EPOLL_CTL_DEL, client_socket, nullptr);
                    continue;
                }

                std::string request_str(buffer, bytes_received);
                std::string response_str = "";

#ifdef PHASE_1

                TelnetRequest request = ParseTelnetRequest(request_str);

                switch (request.type) {
                    case 1:
                        mailbox[request.to].push(request.from + ": " + request.message);
                        response_str.append("Message Sent\n");
                        break;
                    case 2:
                        if (mailbox[request.from].empty())
                            response_str.append("You have no message.\n");
                        else {
                            response_str.append("Your unread message(s):\n");
                            while (!mailbox[request.from].empty()) {
                                response_str.append("> " + mailbox[request.from].front() + "\n");
                                mailbox[request.from].pop();
                            }
                        }
                        break;
                    case 3:
                        close(client_socket);
                        epoll_ctl(epoll_fd, EPOLL_CTL_DEL, client_socket, nullptr);
                        continue;
                    default:
                        response_str.append("Invalid instruction.\n");
                }
                
#elif defined PHASE_2

                HttpRequest request = ParseHttpRequest(request_str);

                std::cout <<
                    request.method << " /// " <<
                    request.path << " /// " <<
                    request.token << " /// " <<
                    request.query << " /// " <<
                    request.body << " \n";
                
                response_str.append("HTTP/1.1 200 OK\r\n");
                response_str.append("Connection: keep-alive\r\n");
                response_str.append("Content-Type: text/plain\r\n");
                response_str.append("Content-Length: 4\r\n\r\n");
                response_str.append("TEST");

#endif
                
                send(client_socket, response_str.c_str(), response_str.size(), 0);
            }
        }
    }

    close(server_socket);
    return 0;
}
