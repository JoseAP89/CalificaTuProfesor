using AutoMapper;
using back_csharp._contracts;
using back_csharp._data;
using back_csharp._repos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._services;

public class UnitOfWork : IUnitOfWork
{
    private readonly TeachersContext _context;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private IUniversityRepo _universities;
    private IStateRepo _states;
    private IUniversityAreaRepo _uniStructures;
    private ICampusRepo _campus;
    private IRosterRepo _roster;
    private IScaleRepo _scale;
    private IRatingRepo _rating;
    private IVoteRepo _vote;
    private IAxumService _axumService;

    public UnitOfWork(TeachersContext context, IConfiguration config, IMapper mapper, IAxumService axum)
    {
        _context = context;
        _config = config;
        _mapper = mapper;
        _axumService = axum;
    }

    public IUniversityRepo Universities => _universities ??= new UniversityRepo(_context, _config);
    public IStateRepo States => _states ??= new StateRepo(_context, _config);
    public IUniversityAreaRepo UniversityAreas => _uniStructures ??= new UniversityAreaRepo(_context, _config);
    public ICampusRepo Campus => _campus ??= new CampusRepo(_context, _config);
    public IRosterRepo Roster => _roster ??= new RosterRepo(_context, _config);
    public IScaleRepo Scale => _scale ??= new ScaleRepo(_context, _config);
    public IRatingRepo Ratings => _rating ??= new RatingRepo(_context, _config, _mapper);
    public IVoteRepo Votes => _vote ??= new VoteRepo(_context, _config, _mapper);
    public IAxumService AxumService => _axumService;

    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}