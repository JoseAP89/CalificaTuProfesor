using System;
using System.Collections.Generic;
using back_csharp._models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace back_csharp._data
{
    public partial class TeachersContext : DbContext
    {
        private readonly IConfiguration _config;

        public TeachersContext()
        {
        }

        public TeachersContext(DbContextOptions<TeachersContext> options, IConfiguration config)
            : base(options)
        {
            _config = config;
        }

        public virtual DbSet<Campus> Campuses { get; set; } = null!;
        public virtual DbSet<Comment> Comments { get; set; } = null!;
        public virtual DbSet<Grade> Grades { get; set; } = null!;
        public virtual DbSet<Roster> Rosters { get; set; } = null!;
        public virtual DbSet<Scale> Scales { get; set; } = null!;
        public virtual DbSet<State> States { get; set; } = null!;
        public virtual DbSet<UniversityArea> UniversityAreas { get; set; } = null!;
        public virtual DbSet<StudyField> StudyFields { get; set; } = null!;
        public virtual DbSet<University> Universities { get; set; } = null!;
        public virtual DbSet<Vote> Votes { get; set; } = null!;
        public virtual DbSet<NotificationType> NotificationTypes { get; set; } = null!;
        public virtual DbSet<Notification> Notifications { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder opt)
        {
            if (!opt.IsConfigured)
            {
                opt.UseNpgsql(_config.GetConnectionString("TeachersDB"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("unaccent");

            modelBuilder.HasDbFunction(typeof(TeachersContext)
               .GetMethod(nameof(Unaccent), new[] { typeof(string) })!)
               .HasName("unaccent");

            // CAMPUS
            modelBuilder.Entity<Campus>(entity =>
            {
                entity.ToTable("campus");

                entity.Property(e => e.CampusId)
                    .HasColumnName("campusid");
                entity.Property(e => e.RecordId)
                    .HasDefaultValueSql("gen_random_uuid()")
                    .HasColumnName("recordid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.UniversityId )
                    .HasColumnName("universityid");
                entity.Property(e => e.StateId )
                    .HasColumnName("stateid");
                entity.Property(e => e.CreatedAt )
                    .HasColumnType("timestamptz")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt )
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.HasIndex(e => new { e.Name, e.UniversityId, e.StateId }, "campus_name_university_id_state_id_key")
                    .IsUnique();


                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .HasColumnName("name");



                entity.HasOne(d => d.State)
                    .WithMany(p => p.Campuses)
                    .HasForeignKey(d => d.StateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("campus_state_id_fkey");

                entity.HasOne(d => d.University)
                    .WithMany(p => p.Campuses)
                    .HasForeignKey(d => d.UniversityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("campus_university_id_fkey");
            });

            // COMMENT
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("comment");

                entity.Property(e => e.CommentId)
                    .HasColumnName("commentid");
                entity.Property(e => e.StudyFieldId)
                    .HasColumnName("studyfieldid");
                entity.Property(e => e.RecordId)
                    .HasColumnName("recordid");
                entity.Property(e => e.Content)
                    .HasMaxLength(250)
                    .IsRequired(true)
                    .HasColumnName("content");
                entity.Property(e => e.SubjectName)
                    .IsRequired(true)
                    .HasColumnName("subjectname");
                entity.Property(e => e.RosterId )
                    .HasColumnName("rosterid");
                entity.Property(e => e.UserId )
                    .HasColumnName("userid");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.Property(e => e.SubjectName)
                    .HasMaxLength(100);

                entity.Property(e => e.RecordId)
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(e => e.UserId)
                    .HasMaxLength(40);

                entity.HasOne(d => d.Roster)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(d => d.RosterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("comment_roster_id_fkey");

                entity.HasOne(d => d.StudyField)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(d => d.StudyFieldId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("comment_studyfield_id_fkey");
            });

            // GRADE
            modelBuilder.Entity<Grade>(entity =>
            {
                entity.ToTable("grade");

                entity.Property(e => e.GradeId)
                    .HasColumnName("gradeid");
                entity.Property(e => e.ScaleId)
                    .HasColumnName("scaleid");
                entity.Property(e => e.CommentId)
                    .HasColumnName("commentid");
                entity.Property(e => e.Stars)
                    .HasColumnName("stars");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.Property(e => e.Stars)
                    .HasDefaultValueSql("0");

                entity.HasOne(d => d.Comment)
                    .WithMany(p => p.Grades)
                    .HasForeignKey(d => d.CommentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("grade_comment_id_fkey");

                entity.HasOne(d => d.Scale)
                    .WithMany(p => p.Grades)
                    .HasForeignKey(d => d.ScaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("grade_scale_id_fkey");
            });

            // ROSTER
            modelBuilder.Entity<Roster>(entity =>
            {
                entity.ToTable("roster");

                entity.Property(e => e.RosterId)
                    .HasColumnName("rosterid");
                entity.Property(e => e.RecordId)
                    .HasDefaultValueSql("gen_random_uuid()")
                    .HasColumnName("recordid");
                entity.Property(e => e.CampusId)
                    .HasColumnName("campusid");
                entity.Property(e => e.TeacherName)
                    .HasColumnName("teachername");
                entity.Property(e => e.TeacherLastname1)
                    .HasColumnName("teacherlastname1");
                entity.Property(e => e.TeacherLastname2)
                    .HasColumnName("teacherlastname2");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.HasIndex(e => new { e.CampusId, e.TeacherName, e.TeacherLastname1, e.TeacherLastname2 }, "roster_campus_id_teacher_name_teacher_lastname12_key")
                    .IsUnique();

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.TeacherLastname1)
                    .HasMaxLength(100);

                entity.Property(e => e.TeacherLastname2)
                    .HasMaxLength(100);

                entity.Property(e => e.TeacherName)
                    .HasMaxLength(100);

                entity.HasOne(d => d.Campus)
                    .WithMany(p => p.Rosters)
                    .HasForeignKey(d => d.CampusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("roster_campus_id_fkey");
            });

            // SCALE
            modelBuilder.Entity<Scale>(entity =>
            {
                entity.ToTable("scale");

                entity.Property(e => e.ScaleId)
                    .HasColumnName("scaleid");
                entity.Property(e => e.Code)
                    .HasColumnName("code");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.Description)
                    .HasColumnName("description");
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnName("modifiedat");

                entity.Property(e => e.ScaleId);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Description)
                    .HasMaxLength(250);

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz");

                entity.Property(e => e.Name)
                    .HasMaxLength(30);
            });

            // STATE
            modelBuilder.Entity<State>(entity =>
            {
                entity.ToTable("state");

                entity.Property(e => e.StateId)
                    .HasColumnName("stateid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.Property(e => e.StateId);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.Name)
                    .HasMaxLength(80);
            });

            // UNIVERSITY AREA
            modelBuilder.Entity<UniversityArea>(entity =>
            {
                entity.ToTable("universityarea");

                entity.Property(e => e.UniversityAreaId)
                    .HasColumnName("universityareaid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.Code)
                    .HasColumnName("code");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.Property(e => e.Code)
                    .HasMaxLength(4);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.Name)
                    .HasMaxLength(300);
                entity.HasMany(d => d.StudyFields)
                    .WithOne(d => d.UniversityArea);
            });

            // STUDY FIELD
            modelBuilder.Entity<StudyField>(entity =>
            {
                entity.ToTable("studyfield");

                entity.Property(e => e.StudyFieldId)
                    .HasColumnName("studyfieldid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.Code)
                    .HasColumnName("code");
                entity.Property(e => e.UniversityAreaId)
                    .HasColumnName("universityareaid");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.Property(e => e.Code)
                    .HasMaxLength(4);
                entity.Property(e => e.Name)
                    .HasMaxLength(300);

                entity.HasOne(d => d.UniversityArea)
                    .WithMany(p => p.StudyFields)
                    .HasForeignKey(d => d.UniversityAreaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("studyfield_uniarea_id_fkey");
            });


            // UNIVERSITY
            modelBuilder.Entity<University>(entity =>
            {
                entity.ToTable("university");

                entity.Property(e => e.UniversityId)
                    .HasColumnName("universityid");
                entity.Property(e => e.RecordId)
                    .HasDefaultValueSql("gen_random_uuid()")
                    .HasColumnName("recordid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.HasIndex(e => e.Name, "university_name_key")
                    .IsUnique();

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.Name)
                    .HasMaxLength(250);
            });

            // VOTE
            modelBuilder.Entity<Vote>(entity =>
            {
                entity.ToTable("vote");

                entity.Property(e => e.VoteId)
                    .HasColumnName("voteid");
                entity.Property(e => e.CommentId)
                    .HasColumnName("commentid");
                entity.Property(e => e.UserId)
                    .HasColumnName("userid");
                entity.Property(e => e.Approval)
                    .HasColumnName("approval");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()")
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("modifiedat");

                entity.Property(e => e.Approval)
                    .IsRequired(false);

                entity.HasOne(d => d.Comment)
                    .WithMany(p => p.Votes)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("vote_comment_id_fkey");
            });

            // NotificationType 
            modelBuilder.Entity<NotificationType>(entity =>
            {
                entity.ToTable("notificationtype");

                entity.HasKey(e => e.NotificationTypeId)
                      .HasName("pk_notificationtype");

                entity.Property(e => e.NotificationTypeId)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.NotificationTypeId)
                    .HasColumnName("notificationtypeid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.Code)
                    .HasColumnName("code");
                entity.Property(e => e.Description)
                    .HasColumnName("description");

                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Code)
                      .HasMaxLength(3);

                entity.HasIndex(e => e.Code)
                      .IsUnique()
                      .HasDatabaseName("ix_notificationtype_code");

                entity.Property(e => e.Description)
                      .HasMaxLength(500);

                entity.HasMany(e => e.Notifications)
                      .WithOne(e => e.NotificationType)
                      .HasForeignKey(e => e.NotificationTypeId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("fk_notification_notificationtype");
            });

            // Notification Configuration
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("notification");

                entity.HasKey(e => e.NotificationId)
                      .HasName("pk_notification");

                entity.Property(e => e.NotificationId)
                    .HasColumnName("notificationid");
                entity.Property(e => e.CommentId)
                    .HasColumnName("commentid");
                entity.Property(e => e.NotificationTypeId)
                    .HasColumnName("notificationtypeid");
                entity.Property(e => e.Message)
                    .HasColumnName("message");
                entity.Property(e => e.UserId)
                    .HasColumnName("userid");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamptz")
                    .HasColumnName("createdat");

                entity.Property(e => e.NotificationId)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.CommentId)
                      .IsRequired();

                entity.Property(e => e.Message)
                      .IsRequired()
                      .HasMaxLength(300);

                entity.Property(e => e.UserId)
                      .IsRequired()
                      .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(e => e.CreatedAt)
                      .IsRequired()
                      .HasDefaultValueSql("NOW()");

                // Composite unique index
                entity.HasIndex(e => new { e.CommentId, e.UserId })
                      .IsUnique()
                      .HasDatabaseName("ix_notification_commentid_userid");
            });


            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
        public static string Unaccent(string input) => throw new NotSupportedException();
    }
}
