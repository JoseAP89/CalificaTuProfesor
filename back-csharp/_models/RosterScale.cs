namespace back_csharp._models;

public class RosterScale
{
    public int RosterScaleId { get; set; }
    public int RosterId { get; set; }
    public int ScaleId { get; set; }
    public double Grade { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ModifiedAt { get; set; }
    
    public virtual Roster Roster { get; set; } = null!;
    public virtual Scale Scale { get; set; } = null!;
}