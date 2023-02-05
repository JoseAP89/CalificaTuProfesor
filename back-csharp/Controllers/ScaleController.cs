using System.Threading.Tasks;
using back_csharp._contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ScaleController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public ScaleController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ScaleDto>>> GetScales()
    {
        try
        {
            var res = await _uow.Scale.GetAll();
            if (res==null)
            {
                return NotFound();
            }
            var scales =_mapper.Map<List<ScaleDto>>(res);
            return Ok(scales);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest($"Hubo un error al obtener la lista de las Escalas.");
        }
    }
    
}