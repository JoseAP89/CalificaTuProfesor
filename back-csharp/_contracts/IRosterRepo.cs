using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._contracts;

public interface IRosterRepo: ICommonRepo<Roster>
{
    Task<RosterDto> GetRosterDTO(int id);
    Task<Roster> GetRoster(int id);
    Task<IEnumerable<TeacherCampus>> GetTeacherCampusByTeacherName(string teacherName);
    Task<Roster> AddRoster(CreateRosterDto rosterDto);
    Task<RosterDto> GetRosterDTO(Guid signature);
    Task<Roster> GetRoster(Guid signature);
}