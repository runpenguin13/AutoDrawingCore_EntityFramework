using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Code", Schema = "dbo")]
    public partial class Code
    {
        public Code()
        {
            Variants = new HashSet<Variant>();
        }

        public int Id { get; set; }
        [Column(TypeName = "nvarchar(10)")]
        public string Type { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }

        public ICollection<Variant> Variants { get; set; }
    }
}
