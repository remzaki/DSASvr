namespace AutomationServer.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using AutomationServer.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<AutomationServer.Models.AutomationServerContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(AutomationServer.Models.AutomationServerContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            context.Elements.AddOrUpdate(x => x.Id,
                new Element()
                {
                    Id = 1,
                    Name = "zip_code_fld",
                    Value = "#LocationViewModel_ZipCode",
                    Description = "Zip Code Field",
                    Screenshot = null
                },
                new Element()
                {
                    Id = 2,
                    Name = "uhone_loading",
                    Value = "div#loading-content.loading",
                    Description = "UHOne Loading element",
                    Screenshot = null
                },
                new Element()
                {
                    Id = 3,
                    Name = "applicant_gender_lst",
                    Value = "select#PrimaryApplicant_Gender",
                    Description = "Primary Applicant Gender Dropdown",
                    Screenshot = null
                },
                new Element()
                {
                    Id = 4,
                    Name = "applicant_dob_fld",
                    Value = "#PrimaryApplicant_BirthDate",
                    Description = "Primary Applicant's Birthdate field",
                    Screenshot = null
                },
                new Element()
                {
                    Id = 5,
                    Name = "tobacco_use_fld",
                    Value = "select#PrimaryApplicant_HasTobaccoUsage",
                    Description = "Primary Applicant Tobacco use",
                    Screenshot = null
                }
            );
        }
    }
}
