using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._contracts;

public interface IRosterRepo: ICommonRepo<Roster>
{
    Task<RosterDto> GetRoster(int id);
    Task<IEnumerable<TeacherCampus>> GetTeacherCampus(string search);
    Task<Roster> AddRoster(CreateRosterDto rosterDto);
}