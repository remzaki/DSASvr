using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AutomationServer.Models
{
    public class ElementDTO
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string Desc { get; set; }
        public bool Screenshot { get; set; }
    }

    public class ElementDetailDTO
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string Desc { get; set; }
        public string Screenshot { get; set; }
    }
}