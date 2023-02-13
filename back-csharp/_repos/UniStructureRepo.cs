using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;

namespace back_csharp._repos;

public class UniStructureRepo: CommonRepo<UniStructure>, IUniStructureRepo
{
    public UniStructureRepo(TeachersContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<Vessel> GetUniStructureInVessel(int uniStructureId)
    {
        var res = (await GetAll<string>(u => u.Name, null))
            .Where(x => x.UniStructureId == uniStructureId )  
            ?.Select( x => 
                new Vessel{Id = x.UniStructureId, Value = x.Name})
            .FirstOrDefault();
        return res;
    }

    public async Task<IEnumerable<Vessel>> GetAllUniStructuresInVessels()
    {
        var res = (await GetAll<string>(u => u.Name, null))
            ?.Select( x => 
                new Vessel{Id = x.UniStructureId, Value = x.Name});
        return res;
    }

}