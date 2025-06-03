using back_csharp._contracts;
using back_csharp._dtos;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Threading;
using back_csharp._data;
using back_csharp.Middleware.models;

namespace back_csharp._services;

public class AxumService : IAxumService
{
    private readonly HttpClient _httpClient;

    public AxumService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<AxumApiResponse> AnalyzeWordsAsync(AxumFilterRequest request)
    {
        if (request == null || request.Words == null || request.Words.Count == 0)
        {
            throw new ApiException("La solicitud de filtrado no puede estar vacia.");
        }
        var response = await _httpClient.PostAsJsonAsync("/api/filter", request);
        response.EnsureSuccessStatusCode();

        return await response?.Content?.ReadFromJsonAsync<AxumApiResponse>() ??
            throw new InvalidOperationException("Error en deserializar la respuesta.");
    }
}
