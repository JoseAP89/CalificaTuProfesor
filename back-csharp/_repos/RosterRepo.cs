using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class RosterRepo: CommonRepo<Roster>, IRosterRepo
{
    public RosterRepo(DbContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<RosterDto> GetRosterDTO(Guid signature)
    {
        var roster = from c in _context.Set<Roster>()
            join s in _context.Set<UniStructure>() on c.UniStructureId equals s.UniStructureId 
            join m in _context.Set<Campus>() on c.CampusId equals m.CampusId 
            where c.Signature == signature select new
            {
                RosterId = c.RosterId,
                Signature = c.Signature,
                TeacherName = c.TeacherName,
                TeacherLastname1 = c.TeacherLastname1,
                TeacherLastname2 = c.TeacherLastname2,
                UniStructureId = c.UniStructureId,
                StructureType = s.Name,
                StructureName = c.StructureName,
                SubjectName = c.SubjectName,
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
                UniStructureId = x.UniStructureId,
                StructureType = x.StructureType,
                StructureName = x.StructureName,
                SubjectName = x.SubjectName,
                CampusId = x.CampusId,
                CampusName = x.CampusName,
            }).SingleOrDefault();
        return res;
    }


    public async Task<RosterDto> GetRosterDTO(int id)
    {
        var roster = from c in _context.Set<Roster>()
            join s in _context.Set<UniStructure>() on c.UniStructureId equals s.UniStructureId 
            join m in _context.Set<Campus>() on c.CampusId equals m.CampusId 
            where c.RosterId == id select new
            {
                RosterId = c.RosterId,
                TeacherName = c.TeacherName,
                TeacherLastname1 = c.TeacherLastname1,
                TeacherLastname2 = c.TeacherLastname2,
                UniStructureId = c.UniStructureId,
                StructureType = s.Name,
                StructureName = c.StructureName,
                SubjectName = c.SubjectName,
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
                UniStructureId = x.UniStructureId,
                StructureType = x.StructureType,
                StructureName = x.StructureName,
                SubjectName = x.SubjectName,
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
        var roster = await _context.Set<Roster>().FirstOrDefaultAsync(r => r.Signature == signature);
        return roster;
    }

    public async Task<IEnumerable<TeacherCampus>> GetTeacherCampus(string search)
    {
        search = search
            .Replace("+", " ")
            .Trim()
            .ToLower()
            .RemoveDiacritics();
        var teacher_ids = await _context.Set<Roster>().FromSqlRaw<Roster>(
            $"SELECT * FROM Roster r WHERE LOWER(UNACCENT(CONCAT(r.TeacherName,' ', r.TeacherLastname1, ' ', r.TeacherLastname2))) LIKE '%{search}%'  LIMIT {MAX_RESULTS} ")
            .AsNoTracking()
            .Select(x => x.RosterId)
            .ToListAsync();
        var res = await (from c in _context.Set<Campus>()
            join r in _context.Set<Roster>()on c.CampusId equals r.CampusId
            where teacher_ids.Contains(r.RosterId)
            orderby r.TeacherName, r.TeacherLastname1, r.TeacherLastname2, c.Name
            select new TeacherCampus()
            {
                RosterId = r.RosterId,
                Signature = r.Signature,
                TeacherName = r.TeacherName,
                TeacherLastname1 = r.TeacherLastname1,
                TeacherLastname2 = r.TeacherLastname2,
                Campus = new CampusDto {Name = c.Name, CampusId = c.CampusId, UniversityId = c.UniversityId},
                SubjectName = r.SubjectName
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
            TeacherLastname2 = rosterDto.TeacherLastname2?.Trim().ToUpper(),
            UniStructureId = rosterDto.UniStructureId,
            StructureName = rosterDto.StructureName,
            SubjectName = rosterDto.SubjectName,
            CampusId = rosterDto.CampusId
        };
        await base.Add(roster);
        return roster;
    }
}