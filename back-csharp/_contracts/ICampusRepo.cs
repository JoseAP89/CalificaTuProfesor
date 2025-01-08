using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._contracts;

public interface ICampusRepo: ICommonRepo<Campus>
{
    Task<CampusDto> GetCampusAsync(int id);
    Task<CampusDto> GetCampusByRecordIdAsync(Guid recordId);
    Task<IEnumerable<Vessel>> GetCampusSearch(string search);
    Task<IEnumerable<CampusUniversity>> GetCampusUniversity(string search);
    Task<Campus> AddCampus(CampusDto campusDto);
    Task<Campus> GetShortCampus(string name);
    Task<Campus> GetShortCampus(int id);
}