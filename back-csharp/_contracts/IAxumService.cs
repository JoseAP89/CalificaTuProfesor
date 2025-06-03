using back_csharp._dtos;

namespace back_csharp._contracts;

public interface IAxumService
{
    Task<AxumApiResponse> AnalyzeWordsAsync(AxumFilterRequest request);
}
