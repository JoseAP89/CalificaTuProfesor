using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._contracts;

public interface IUniStructureRepo: ICommonRepo<UniStructure>
{
    Task<Vessel> GetUniStructureInVessel(int uniStructureId);
    Task<IEnumerable<Vessel>> GetAllUniStructuresInVessels();

}