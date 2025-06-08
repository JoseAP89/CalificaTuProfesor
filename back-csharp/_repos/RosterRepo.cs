using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;
using System.Data;
using back_csharp.Middleware.models;

namespace back_csharp._repos;

public class RosterRepo: CommonRepo<Roster>, IRosterRepo
{
    public RosterRepo(TeachersContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<RosterDto> GetFullInfoRosterAsync(Guid signature)
    {
        if (signature == Guid.Empty)
        {
            throw new Exception("RecordId es requerido.");
        }
        var rosterId = await _context.Rosters.FirstOrDefaultAsync(r => r.RecordId == signature);
        if (rosterId == null)
        {
            throw new ApiException("No existe el maestro.");
        }
        return await GetFullInfoRosterAsync(rosterId.RosterId);
    }


    public async Task<RosterDto> GetFullInfoRosterAsync(int id)
    {
        var roster = from r in _context.Rosters
            join c in _context.Campuses on r.CampusId equals c.CampusId 
            join s in _context.States on c.StateId equals s.StateId
            join u in _context.Universities on c.UniversityId equals u.UniversityId
            where r.RosterId == id select new
            {
                RosterId = r.RosterId,
                RecordId = r.RecordId,
                TeacherName = r.TeacherName,
                TeacherLastname1 = r.TeacherLastname1,
                TeacherLastname2 = r.TeacherLastname2,
                CampusId = r.CampusId,
                CampusName = c.Name,
                StateName = s.Name,
                StateId = s.StateId,
                UniversityName = u.Name,
                UniversityId = u.UniversityId
            };
        var res = (await roster.AsNoTracking().ToListAsync())?.Select( x => 
            new RosterDto
            {
                RosterId = x.RosterId,
                RecordId = x.RecordId,
                TeacherName = x.TeacherName,
                TeacherLastname1 = x.TeacherLastname1,
                TeacherLastname2 = x.TeacherLastname2,
                CampusId = x.CampusId,
                CampusName = x.CampusName,
                StateName = x.StateName,
                StateId = x.StateId,
                UniversityName = x.UniversityName,
                UniversityId = x.UniversityId
            }).SingleOrDefault();
        return res;
    }

    public async Task<Roster> GetRoster(int id)
    {
        var roster = await _context.Set<Roster>().FirstOrDefaultAsync(r => r.RosterId == id);
        return roster;
    }

    public async Task<Roster> GetRoster(Guid signature)
    {
        var roster = await _context.Set<Roster>().FirstOrDefaultAsync(r => r.RecordId == signature);
        return roster;
    }

    public async Task<IEnumerable<TeacherCampus>> GetTeacherCampusByTeacherName(string teacherName)
    {
        teacherName = teacherName
            .Replace("+", " ")
            .Trim()
            .ToLower()
            .RemoveDiacritics();
        var teacher_ids = await _context.Set<Roster>().FromSqlInterpolated<Roster>(
            $"SELECT * FROM Roster r WHERE LOWER(UNACCENT(CONCAT(r.TeacherName,' ', r.TeacherLastname1, ' ', r.TeacherLastname2))) LIKE '%' || {teacherName} || '%'  LIMIT {MAX_RESULTS} ")
            .AsNoTracking()
            .Select(x => x.RosterId)
            .ToListAsync();
        var res = await (from c in _context.Set<Campus>()
            join r in _context.Set<Roster>() on c.CampusId equals r.CampusId
            where teacher_ids.Contains(r.RosterId)
            orderby r.TeacherName, r.TeacherLastname1, r.TeacherLastname2, c.Name
            select new TeacherCampus()
            {
                RosterId = r.RosterId,
                Signature = r.RecordId,
                TeacherName = r.TeacherName,
                TeacherLastname1 = r.TeacherLastname1,
                TeacherLastname2 = r.TeacherLastname2,
                Campus = new CampusDto {Name = c.Name, CampusId = c.CampusId, UniversityId = c.UniversityId},
            }).AsNoTracking().ToListAsync();
        return res;
    }

    public async Task<Roster> AddRoster(CreateRosterDto rosterDto)
    {
        var roster = new Roster()
        {
            RosterId = rosterDto.RosterId,
            TeacherName = rosterDto.TeacherName.Trim().ToUpper(),
            TeacherLastname1 = rosterDto.TeacherLastname1.Trim().ToUpper(),
            TeacherLastname2 = rosterDto.TeacherLastname2?.Trim().ToUpper() ?? "",
            CampusId = rosterDto.CampusId
        };
        await base.Add(roster);
        return roster;
    }
}