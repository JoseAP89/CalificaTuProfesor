using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back_csharp._contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;

namespace back_csharp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public StateController(IUnitOfWork uow, TeachersContext context)
        {
            _uow = uow;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vessel>>> GetStates()
        {
            try
            {
                var res = await _uow.States.GetAllInVessels();
                if (res==null)
                {
                    return NoContent();
                }
                return Ok(res);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al obtener la lista de los Estados.");
            }
        }
        
        
    }
}
