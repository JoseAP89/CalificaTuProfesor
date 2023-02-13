using AutoMapper;
using back_csharp._contracts;
using back_csharp._data;
using back_csharp._repos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._services;

public class UnitOfWork: IUnitOfWork
{
    private readonly TeachersContext _context;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private IUniversityRepo _universities;
    private IStateRepo _states;
    private IUniStructureRepo _uniStructures;
    private ICampusRepo _campus;
    private IRosterRepo _roster;
    private IScaleRepo _scale;
    private IRatingRepo _rating;

    public UnitOfWork(TeachersContext context, IConfiguration config, IMapper mapper)
    {
        _context = context;
        _config = config;
        _mapper = mapper;
    }

    public IUniversityRepo Universities => _universities ??= new UniversityRepo(_context, _config);
    public IStateRepo States => _states ??= new StateRepo(_context, _config);
    public IUniStructureRepo UniStructures => _uniStructures ??= new UniStructureRepo(_context, _config);
    public ICampusRepo Campus => _campus ??= new CampusRepo(_context, _config);
    public IRosterRepo Roster => _roster ??= new RosterRepo(_context, _config);
    public IScaleRepo Scale => _scale ??= new ScaleRepo(_context, _config);
    public IRatingRepo Ratings => _rating ??= new RatingRepo(_context, _config, _mapper);

    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}