using back_csharp._contracts;
using back_csharp._models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RatingController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public RatingController(IUnitOfWork uow)
    {
        _uow = uow;
    }

    [HttpGet]
    public async Task<ActionResult<Scale>> Example()
    {
        var res = await _uow.Ratings.Example();
        if (res == null)
        {
            return NotFound();
        }
        return Ok(res);
    }
}
