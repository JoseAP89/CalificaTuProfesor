using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._contracts;

public interface IUniversityAreaRepo: ICommonRepo<UniversityArea>
{
    Task<Vessel> GetUniversityAreaVesselAsync(int universityAreaId);
    Task<IEnumerable<Vessel>> GetAllUniversityAreaVesselsAsync();

}