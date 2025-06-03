using System;

namespace back_csharp.Middleware.models;

public class ApiException : Exception
{
    public int StatusCode { get; }

    public ApiException(string message, int statusCode = 400)
        : base(message)
    {
        StatusCode = statusCode;
    }

    public ApiException(string message, Exception inner, int statusCode = 400)
        : base(message, inner)
    {
        StatusCode = statusCode;
    }
}

