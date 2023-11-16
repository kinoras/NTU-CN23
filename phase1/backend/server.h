#include <iostream>
#include <string>
#include <cstring>
#include <vector>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <unistd.h>
#include <regex>

#define ushort unsigned short
#define MAX_EVENTS 5

#define ERR_EXIT(a) \
    do {            \
        perror(a);  \
        exit(1);    \
    } while (0)

struct TelnetRequest {
    ushort type;
    std::string from;
    std::string to;
    std::string message;
};

struct HttpRequest {
    std::string method;
    std::string path;
    std::string token;
    std::string query;
    std::string body;
};

struct HttpResponse {
    int status;
    std::string body;
};

TelnetRequest ParseTelnetRequest(const std::string& request) {
    TelnetRequest parsedRequest;

    std::regex send_pattern("from (.*), to (.*), says (.*)\\s*");
    std::regex recv_pattern("check mail (.*)\\s*");
    std::regex exit_pattern("exit\\s*");
    std::smatch matches;
    
    if (std::regex_match(request, matches, send_pattern)) {
        parsedRequest.type = 1;
        parsedRequest.from = matches[1];
        parsedRequest.to = matches[2];
        parsedRequest.message = std::regex_replace(matches[3].str(), std::regex("\n"), "");
    } else if (std::regex_match(request, matches, recv_pattern)) {
        parsedRequest.type = 2;
        parsedRequest.from = matches[1];
    } else if (std::regex_match(request, matches, exit_pattern)) {
        parsedRequest.type = 3;
    } else {
        parsedRequest.type = -1;
    }

    return parsedRequest;
}

HttpRequest ParseHttpRequest(const std::string& request) {
    HttpRequest parsedRequest;

    // Find the method
    size_t methodEnd = request.find(' ');
    if (methodEnd != std::string::npos) {
        parsedRequest.method = request.substr(0, methodEnd);
    }

    // Find the path
    size_t pathStart = methodEnd + 1;
    size_t pathEnd = request.find(' ', pathStart);
    if (pathEnd != std::string::npos) {
        parsedRequest.path = request.substr(pathStart, pathEnd - pathStart);
    }

    // Find the token (if present)
    size_t authHeaderPos = request.find("Authorization: Bearer ");
    if (authHeaderPos != std::string::npos) {
        size_t tokenStart = authHeaderPos + 22;
        size_t tokenEnd = request.find("\r\n", tokenStart);
        if (tokenEnd != std::string::npos) {
            parsedRequest.token = request.substr(tokenStart, tokenEnd - tokenStart);
        }
    }

    // Find the query string (if present)
    size_t queryStart = request.find('?');
    if (queryStart != std::string::npos) {
        size_t queryEnd = request.find(' ', queryStart);
        if (queryEnd != std::string::npos) {
            parsedRequest.query = request.substr(queryStart + 1, queryEnd - queryStart - 1);
        }
    }

    // Find the body (if present)
    size_t bodyStart = request.find("\r\n\r\n");
    if (bodyStart != std::string::npos) {
        parsedRequest.body = request.substr(bodyStart + 4);
    }

    return parsedRequest;
}
