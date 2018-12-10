using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_File")]
    public partial class XFile
    {
        [Key]
        public int FileIdx { get; set; }
        [StringLength(2048)]
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FilePath { get; set; }
        public int? FileSize { get; set; }
    }
}
