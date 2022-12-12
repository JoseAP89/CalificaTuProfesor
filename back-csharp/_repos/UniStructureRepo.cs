using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class UniStructureRepo: CommonRepo<UniStructure>, IUniStructureRepo
{
    public UniStructureRepo(DbContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<IEnumerable<Vessel>> GetAllUniStructuresInVessels()
    {
        var res = (await GetAll<string>(u => u.Name, null))
            ?.Select( x => 
                new Vessel{Id = x.UniStructureId, Value = x.Name});
        return res;
    }
}