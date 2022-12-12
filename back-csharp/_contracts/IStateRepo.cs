using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._contracts;

public interface IStateRepo: ICommonRepo<State>
{
    Task<IEnumerable<Vessel>> GetAllInVessels();
}
