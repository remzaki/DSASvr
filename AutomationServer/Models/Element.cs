using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutomationServer.Models
{
    public class Element
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Key]
        [Required]
        [Index(IsUnique = true)]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [Index(IsUnique = true)]
        [StringLength(255)]
        public string Value { get; set; }

        public string Description { get; set; }
        public string Screenshot { get; set; }
    }
}