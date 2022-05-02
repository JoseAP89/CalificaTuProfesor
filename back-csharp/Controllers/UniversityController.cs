using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_csharp._data;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UniversityController : ControllerBase
    {
        private readonly TeachersContext _context;

        public UniversityController(TeachersContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> GetUniversities()
        {
            var universities = from uni in _context.Universities 
                orderby uni.Name select uni;
            if (universities==null)
            {
                return NoContent();
            }

            return Ok(await universities.AsNoTracking().ToListAsync());

        }
        
        [HttpPost]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> AddUniversity()
        {
            var universities = from uni in _context.Universities 
                orderby uni.Name select uni;
            if (universities==null)
            {
                return NoContent();
            }

            return Ok(await universities.ToListAsync());

        }
    }
}
