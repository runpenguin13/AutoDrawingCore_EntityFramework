using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("WordMap", Schema = "Drawing")]
    public partial class WordMap
    {
        public WordMap()
        {
            Diagrams = new HashSet<Diagram>();
            VisioMaps = new HashSet<VisioMap>();
        }

        public int Id { get; set; }
        public int? ProductId { get; set; }
        public int? VariantId { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string ComponentGroup { get; set; }
        public string ComponentPart { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Mass { get; set; }
        public int? Quantity { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string ElementName { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string ElementType { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Object { get; set; }
        public string Desc { get; set; }
        public string Condition { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string Method { get; set; }
        public string Value { get; set; }
        public string VariantIds { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }

        public Product Product { get; set; }
        public Variant Variant { get; set; }
        public ICollection<Diagram> Diagrams { get; set; }
        public ICollection<VisioMap> VisioMaps { get; set; }
    }
}
