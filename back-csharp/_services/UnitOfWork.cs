using back_csharp._contracts;
using back_csharp._data;
using back_csharp._repos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._services;

public class UnitOfWork: IUnitOfWork
{
    private readonly DbContext _context;
    private readonly IConfiguration _config;
    private IUniversityRepo _universities;
    private IStateRepo _states;
    private IUniStructureRepo _uniStructures;
    private ICampusRepo _campus;
    private IRosterRepo _roster;
    private IScaleRepo _scale;

    public UnitOfWork(TeachersContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public IUniversityRepo Universities => _universities ??= new UniversityRepo(_context, _config);
    public IStateRepo States => _states ??= new StateRepo(_context, _config);
    public IUniStructureRepo UniStructures => _uniStructures ??= new UniStructureRepo(_context, _config);
    public ICampusRepo Campus => _campus ??= new CampusRepo(_context, _config);
    public IRosterRepo Roster => _roster ??= new RosterRepo(_context, _config);
    public IScaleRepo Scale => _scale ??= new ScaleRepo(_context, _config);

    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}