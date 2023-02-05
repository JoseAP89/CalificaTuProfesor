using back_csharp._contracts;
using back_csharp._models;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace back_csharp._repos;

public class RatingRepo: IRatingRepo
{
    private readonly DbContext _context;
    private readonly IConfiguration _config;
    private readonly string _connectionString;

    public RatingRepo(DbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
        _connectionString = _config.GetConnectionString("TeachersDB");
    }

    public async Task<IEnumerable<Scale>> Example()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        // Create a query that retrieves all authors"    
        var sql = "SELECT * FROM scale ORDER BY code";
        // Use the Query method to execute the query and return a list of objects
        List<Scale> scales = (await connection.QueryAsync<Scale>(sql)).ToList();
        return scales;  
    }
}
