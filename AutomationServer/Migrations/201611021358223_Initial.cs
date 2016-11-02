namespace AutomationServer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Elements",
                c => new
                    {
                        Name = c.String(nullable: false, maxLength: 255),
                        Id = c.Int(nullable: false, identity: true),
                        Value = c.String(nullable: false, maxLength: 255),
                        Description = c.String(),
                        Screenshot = c.String(),
                    })
                .PrimaryKey(t => t.Name)
                .Index(t => t.Name, unique: true)
                .Index(t => t.Value, unique: true);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.Elements", new[] { "Value" });
            DropIndex("dbo.Elements", new[] { "Name" });
            DropTable("dbo.Elements");
        }
    }
}
