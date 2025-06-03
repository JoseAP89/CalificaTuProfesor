using back_csharp._contracts;
using back_csharp._dtos;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Threading;
using back_csharp._data;

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
        try
        {
            var response = await _httpClient.PostAsJsonAsync("/api/filter", request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<AxumApiResponse>() ??
                throw new InvalidOperationException("Error en deserializar la respuesta.");
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}
