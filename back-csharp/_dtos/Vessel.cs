namespace back_csharp._dtos;

public class Vessel
{
    public int Id { get; set; }
    public Guid Signature { get; set; } 
    public string Value { get; set; } = null!;
}