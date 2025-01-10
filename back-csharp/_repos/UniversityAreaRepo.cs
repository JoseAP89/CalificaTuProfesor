using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;

namespace back_csharp._repos;

public class UniversityAreaRepo: CommonRepo<UniversityArea>, IUniversityAreaRepo
{
    public UniversityAreaRepo(TeachersContext context, IConfiguration config) : base(context, config)
    {
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

    public async Task<IEnumerable<Vessel>> GetAllUniversityAreaVesselsAsync()
    {
        var res = (await GetAll<string>(u => u.Name, null))
            ?.Select( x => 
                new Vessel{Id = x.UniversityAreaId, Value = x.Name});
        return res;
    }

}