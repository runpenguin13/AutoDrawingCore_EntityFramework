using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    public class XFileRepository
    {
        [Key]
        public int FileIdx { get; set; }
        public int? AppIdx { get; set; }
        [StringLength(3)]
        public string AppCategory { get; set; }
    }
}
