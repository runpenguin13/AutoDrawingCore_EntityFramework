using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    public partial class XAppComponent
    {
        public XAppComponent()
        {
            
        }

        [Key]
        public int AppIdx { get; set; }
        [StringLength(3)]
        public string AppCategory { get; set; }
        public int ComponentIdx { get; set; }

        [ForeignKey("ComponentIdx")]
        public XComponent xComponent { get; set; }
    }
}
