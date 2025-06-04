using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;

namespace back_csharp._repos;

public class UniversityAreaRepo: CommonRepo<UniversityArea>, IUniversityAreaRepo
{
    private new readonly TeachersContext _context;

    public UniversityAreaRepo(TeachersContext context, IConfiguration config) : base(context, config)
    {
        this._context = context;
    }

    public async Task<Vessel> GetUniversityAreaVesselAsync(int uniAreaId)
    {
        var res = (await GetAll<string>(u => u.Name, null))
            .Where(x => x.UniversityAreaId == uniAreaId )  
            ?.Select( x => 
                new Vessel{Id = x.UniversityAreaId, Value = x.Name})
            .FirstOrDefault();
        return res;
    }

    public async Task<IEnumerable<UniversityArea>> GetAllUniversityAreaVesselsAsync()
    {
        var res = await _context.UniversityAreas
            .AsNoTracking()
            .Include(x => x.StudyFields)
            .ToListAsync();
        res = res
            .Select(x =>
            {
                x.StudyFields = x.StudyFields.OrderBy(s => s.Name).ToList();
                return x;
            }).ToList();
        return res;
    }

}