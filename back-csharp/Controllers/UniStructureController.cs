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
    public class UniStructureController : ControllerBase
    {
        private readonly TeachersContext _context;
        private readonly IUnitOfWork _uow;

        public UniStructureController(TeachersContext context, IUnitOfWork uow)
        {
            _context = context;
            _uow = uow;
        }

        [HttpGet("{uniStructureId}")]
        public async Task<ActionResult<Vessel>> GetUniStructure(int uniStructureId)
        {
            try
            {
                var res = await _uow.UniStructures.GetUniStructureInVessel(uniStructureId);
                if (res==null)
                {
                    return NotFound();
                }
                return Ok(res);

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vessel>>> GetUniStructures()
        {
            try
            {
                var res = await _uow.UniStructures.GetAllUniStructuresInVessels();
                if (res==null)
                {
                    return NotFound();
                }
                return Ok(res);

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        
        
    }
}
