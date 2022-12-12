using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class StateRepo: CommonRepo<State>, IStateRepo
{
    public StateRepo(DbContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<IEnumerable<Vessel>> GetAllInVessels()
    {
        var states = await base.GetAll<State>(null, null);
        return states.Select(state => new Vessel
        {
            Id = state.StateId,
            Value = state.Name
        }).ToList();
    }
}