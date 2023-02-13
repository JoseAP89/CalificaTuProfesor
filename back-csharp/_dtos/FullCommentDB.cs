using System.ComponentModel.DataAnnotations.Schema;

namespace back_csharp._dtos;

public class FullCommentDB
{
    // ROSTER
    [Column("rosterrosterid")]
    public int RosterRosterid { get; set; }
    [Column("rostercampusid")]
    public int RosterCampusid {get; set;}
    [Column("rosterteachername")]
    public string RosterTeachername {get; set;}
    [Column("rosterteacherlastname1")]
    public string RosterTeacherlastname1 {get; set;}
    [Column("rosterteacherlastname2")]
    public string RosterTeacherlastname2 {get; set;}
    [Column("rosterunistructureid")]
    public int RosterUnistructureid {get; set;}
    [Column("rosterstructurename")]
    public string RosterStructurename {get; set;}
    [Column("rostercreatedat")]
    public DateTime RosterCreatedat {get; set;}
    [Column("rostermodifiedat")]
    public DateTime? RosterModifiedat {get; set;}
    [Column("rosterrecordid")]

    // COMMENT
    public Guid RosterRecordid {get; set;}
    [Column("commentcommentid")]
    public int CommentCommentid {get; set;}
    [Column("commentrosterid")]
    public int CommentRosterid {get; set;}
    [Column("commentcontent")]
    public string CommentContent {get; set;}
    [Column("commentuserid")]
    public Guid CommentUserid {get; set;}
    [Column("commentcreatedat")]
    public DateTime CommentCreatedat {get; set;}
    [Column("commentmodifiedat")]
    public DateTime? CommentModifiedat {get; set;}
    [Column("commentrecordid")]
    public Guid CommentRecordid {get; set;}
    [Column("commentsubjectname")]
    public string CommentSubjectname {get; set;}

    // GRADE
    [Column("gradegradeid")]
    public int GradeGradeid {get; set;}
    [Column("gradescaleid")]
    public int GradeScaleid {get; set;}
    [Column("gradecommentid")]
    public int GradeCommentid {get; set;}
    [Column("gradestars")]
    public double GradeStars {get; set;}
    [Column("gradecreatedat")]
    public DateTime GradeCreatedat {get; set;}
    [Column("grademodifiedat")]

    // SCALE
    public DateTime? GradeModifiedat {get; set;}
    [Column("scalescaleid")]
    public int ScaleScaleid {get; set;}
    [Column("scalecode")]
    public string ScaleCode {get; set;}
    [Column("scalename")]
    public string ScaleName {get; set;}
    [Column("scaledescription")]
    public string ScaleDescription {get; set;}
    [Column("scalecreatedat")]
    public DateTime ScaleCreatedat {get; set;}
    [Column("scalemodifiedat")]
    public DateTime? ScaleModifiedat {get; set;}

    // VOTE
    [Column("votevoteid")]
    public int VoteVoteid {get; set;}
    [Column("votecommentid")]
    public int VoteCommentid {get; set;}
    [Column("voteapproval")]
    public Guid VoteUserid {get; set;}
    [Column("voteuserid")]
    public bool? VoteApproval {get; set;}
    [Column("votecreatedat")]
    public DateTime VoteCreatedat {get; set;}
    [Column("votemodifiedat")]
    public DateTime? VoteModifiedat {get; set;}
}
