using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public UniStructureController(TeachersContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Vessel>> GetUniStructures()
        {
            var structure = from c in _context.UniStructures
                select c;
            var res = (await structure.AsNoTracking().ToListAsync())?.Select( x => 
                new Vessel{Id = x.UniStructureId, Value = x.Name}).ToList();
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
        
    }
}
