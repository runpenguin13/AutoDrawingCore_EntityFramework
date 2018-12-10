using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("VisioMap", Schema = "Drawing")]
    public partial class VisioMap
    {
        public VisioMap()
        {
            Diagrams = new HashSet<Diagram>();
            Shapes = new HashSet<Shape>();
            Relations = new HashSet<RelationVisiomap>();
        }

        public int Id { get; set; }
        public int? ProductId { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Group { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Title { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Default { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string EnableLayer { get; set; }
        public int? WordMapId { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
        [ForeignKey("WordMapId")]
        public WordMap WordMap { get; set; }
        public ICollection<Diagram> Diagrams { get; set; }
        public ICollection<Shape> Shapes { get; set; }
        public ICollection<RelationVisiomap> Relations { get; set; }
    }
}
