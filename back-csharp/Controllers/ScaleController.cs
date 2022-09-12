using System.Threading.Tasks;
using back_csharp._contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ScaleController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ScaleController(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<ActionResult<IEnumerable<ScaleDto>>> GetScales()
    {
        try
        {
            var res = await _uow.Scale.GetAll();
            if (res==null)
            {
                return NoContent();
            }

            var scales = res.Select(s => new ScaleDto()
            {
                ScaleId = s.ScaleId,
                Description = s.Description,
                Name = s.Name
            });
            return Ok(scales);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest($"Hubo un error al obtener la lista de las Escalas.");
        }
    }
    
}