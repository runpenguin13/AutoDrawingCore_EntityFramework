using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Variant", Schema = "Production")]
    public partial class Variant
    {
        public Variant()
        {
            Configurations = new HashSet<Configuration>();
            WordMaps = new HashSet<WordMap>();
        }

        public int Id { get; set; }
        public string ComponentName { get; set; }
        public int? ProductId { get; set; }
        public string Group { get; set; }
        public int? Default { get; set; }
        public int? Priority { get; set; }
        public string Remark { get; set; }
        public int? Quantity { get; set; }

        [Column(TypeName ="nvarchar(50)")]
        public string Unit { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        public string Mass { get; set; }
        public int? ParentId { get; set; }
        public DateTime? Date { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }

        public int? VariantGroup { get; set; }
        [ForeignKey("VariantGroup")]
        public Code Code { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [ForeignKey("ParentId")]
        public Product Parent { get; set; }

        public virtual ICollection<Configuration> Configurations { get; set; }
        public virtual ICollection<WordMap> WordMaps { get; set; }
    }
}
