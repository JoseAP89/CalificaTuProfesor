using back_csharp._contracts;
using back_csharp._dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AxumController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public AxumController(IUnitOfWork uow)
    {
        this._uow = uow;
    }

    [HttpPost]
    public async Task<ActionResult<AxumApiResponse>> AnalyzeWords(AxumFilterRequest request)
    {
        var response = await _uow.AxumService.AnalyzeWordsAsync(request);
        return Ok(response);
    }
}
