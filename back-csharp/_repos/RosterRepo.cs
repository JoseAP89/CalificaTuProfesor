using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;

namespace back_csharp._repos;

public class RosterRepo: CommonRepo<Roster>, IRosterRepo
{
    public RosterRepo(TeachersContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<RosterDto> GetRosterDTO(Guid signature)
    {
        var roster = from c in _context.Set<Roster>()
            join m in _context.Set<Campus>() on c.CampusId equals m.CampusId 
            where c.RecordId == signature select new
            {
                RosterId = c.RosterId,
                RecordId = c.RecordId,
                TeacherName = c.TeacherName,
                TeacherLastname1 = c.TeacherLastname1,
                TeacherLastname2 = c.TeacherLastname2,
                CampusId = c.CampusId,
                CampusName = m.Name
            };
        var res = (await roster.AsNoTracking().ToListAsync())?.Select( x => 
            new RosterDto
            {
                RosterId = x.RosterId,
                TeacherName = x.TeacherName,
                TeacherLastname1 = x.TeacherLastname1,
                TeacherLastname2 = x.TeacherLastname2,
                CampusId = x.CampusId,
                CampusName = x.CampusName,
                RecordId = x.RecordId
            }).SingleOrDefault();
        return res;
    }


    public async Task<RosterDto> GetRosterDTO(int id)
    {
        var roster = from c in _context.Set<Roster>()
            join m in _context.Set<Campus>() on c.CampusId equals m.CampusId 
            where c.RosterId == id select new
            {
                RosterId = c.RosterId,
                TeacherName = c.TeacherName,
                TeacherLastname1 = c.TeacherLastname1,
                TeacherLastname2 = c.TeacherLastname2,
                CampusId = c.CampusId,
                CampusName = m.Name
            };
        var res = (await roster.AsNoTracking().ToListAsync())?.Select( x => 
            new RosterDto
            {
                RosterId = x.RosterId,
                TeacherName = x.TeacherName,
                TeacherLastname1 = x.TeacherLastname1,
                TeacherLastname2 = x.TeacherLastname2,
                CampusId = x.CampusId,
                CampusName = x.CampusName,
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