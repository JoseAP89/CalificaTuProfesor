using System;
using System.Collections.Generic;
using back_csharp._models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace back_csharp._data
{
    public partial class TeachersContext : DbContext
    {
        public TeachersContext()
        {
        }

        public TeachersContext(DbContextOptions<TeachersContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Campus> Campuses { get; set; } = null!;
        public virtual DbSet<Comment> Comments { get; set; } = null!;
        public virtual DbSet<Grade> Grades { get; set; } = null!;
        public virtual DbSet<Roster> Rosters { get; set; } = null!;
        public virtual DbSet<Scale> Scales { get; set; } = null!;
        public virtual DbSet<State> States { get; set; } = null!;
        public virtual DbSet<UniStructure> UniStructures { get; set; } = null!;
        public virtual DbSet<University> Universities { get; set; } = null!;
        public virtual DbSet<Vote> Votes { get; set; } = null!;
        public virtual DbSet<RosterScale> RosterScales { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder opt)
        {
            if (!opt.IsConfigured)
            {
                opt.UseNpgsql("Host=localhost;Username=joseap;Password=J1o2s3e4;Database=teachers");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("unaccent");

            // CAMPUS
            modelBuilder.Entity<Campus>(entity =>
            {
                entity.ToTable("campus");

                entity.Property(e => e.CampusId)
                    .HasColumnName("campusid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.UniversityId )
                    .HasColumnName("universityid");
                entity.Property(e => e.StateId )
                    .HasColumnName("stateid");
                entity.Property(e => e.CreatedAt )
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt )
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
                entity.Property(e => e.Content)
                    .HasMaxLength(250)
                    .HasColumnName("content");
                entity.Property(e => e.RosterId )
                    .HasColumnName("rosterid");
                entity.Property(e => e.TokenId )
                    .HasColumnName("tokenid");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnName("modifiedat");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.TokenId)
                    .HasMaxLength(40);

                entity.HasOne(d => d.Roster)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(d => d.RosterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("comment_roster_id_fkey");
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
                entity.Property(e => e.TokenId)
                    .HasColumnName("tokenid");
                entity.Property(e => e.Stars)
                    .HasColumnName("stars");
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnName("modifiedat");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.Stars)
                    .HasDefaultValueSql("0");

                entity.Property(e => e.TokenId)
                    .HasMaxLength(20);

                entity.HasOne(d => d.Comment)
                    .WithOne(p => p.Grade)
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
                    .HasColumnName("recordid");
                entity.Property(e => e.CampusId)
                    .HasColumnName("campusid");
                entity.Property(e => e.TeacherName)
                    .HasColumnName("teachername");
                entity.Property(e => e.TeacherLastname1)
                    .HasColumnName("teacherlastname1");
                entity.Property(e => e.TeacherLastname2)
                    .HasColumnName("teacherlastname2");
                entity.Property(e => e.SubjectName)
                    .HasColumnName("subjectname");
                entity.Property(e => e.UniStructureId)
                    .HasColumnName("unistructureid");
                entity.Property(e => e.StructureName)
                    .HasColumnName("structurename");
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnName("modifiedat");

                entity.HasIndex(e => new { e.CampusId, e.TeacherName, e.TeacherLastname1, e.TeacherLastname2, e.SubjectName }, "roster_campus_id_teacher_name_teacher_lastname1_teacher_las_key")
                    .IsUnique();

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.StructureName)
                    .HasMaxLength(100);

                entity.Property(e => e.SubjectName)
                    .HasMaxLength(100);

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

                entity.HasOne(d => d.UniStructure)
                    .WithMany(p => p.Rosters)
                    .HasForeignKey(d => d.UniStructureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("roster_uni_structure_id_fkey");
            });

            // SCALE
            modelBuilder.Entity<Scale>(entity =>
            {
                entity.ToTable("scale");

                entity.Property(e => e.ScaleId)
                    .HasColumnName("scaleid");
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
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Description)
                    .HasMaxLength(250);

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

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
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
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

            // UNISTRUCTURE
            modelBuilder.Entity<UniStructure>(entity =>
            {
                entity.ToTable("unistructure");

                entity.Property(e => e.UniStructureId)
                    .HasColumnName("unistructureid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.Code)
                    .HasColumnName("code");
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnName("modifiedat");

                entity.Property(e => e.Code)
                    .HasMaxLength(2);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.Name)
                    .HasMaxLength(300);
            });

            // UNIVERSITY
            modelBuilder.Entity<University>(entity =>
            {
                entity.ToTable("university");

                entity.Property(e => e.UniversityId)
                    .HasColumnName("universityid");
                entity.Property(e => e.Name)
                    .HasColumnName("name");
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
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
                entity.Property(e => e.Approval)
                    .HasColumnName("approval");
                entity.Property(e => e.TokenId)
                    .HasColumnName("tokenid");
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnName("modifiedat");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.TokenId)
                    .HasMaxLength(40);

                entity.HasOne(d => d.Comment)
                    .WithMany(p => p.Votes)
                    .HasForeignKey(d => d.CommentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("vote_comment_id_fkey");
            });

            // ROSTER_SCALE
            modelBuilder.Entity<RosterScale>(entity =>
            {
                entity.ToTable("rosterscale");

                entity.Property(e => e.RosterScaleId)
                    .HasColumnName("rosterscaleid");
                entity.Property(e => e.RosterId)
                    .HasColumnName("rosterid");
                entity.Property(e => e.ScaleId)
                    .HasColumnName("scaleid");
                entity.Property(e => e.Grade)
                    .HasColumnName("grade");
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("createdat");
                entity.Property(e => e.ModifiedAt)
                    .HasColumnName("modifiedat");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.Grade)
                    .HasDefaultValueSql("0");

                entity.HasOne(d => d.Roster)
                    .WithMany(p => p.RosterScales)
                    .HasForeignKey(d => d.RosterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("rosterscale_roster_id_fkey");

                entity.HasOne(d => d.Scale)
                    .WithMany(p => p.RosterScales)
                    .HasForeignKey(d => d.ScaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("rosterscale_scale_id_fkey");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
