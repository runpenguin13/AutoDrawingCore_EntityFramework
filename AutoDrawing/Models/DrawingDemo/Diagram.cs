using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Diagram", Schema = "Drawing")]
    public partial class Diagram
    {
        public Diagram()
        {
            Notations = new HashSet<Diagram>();
        }

        public int Id { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Group { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Title { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Value { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string LayerName { get; set; }
        public int? DrawingId { get; set; }
        public int? WordMapId { get; set; }
        public int? VisioMapId { get; set; }
        public int? ParentId { get; set; }
        public int? ShapeId { get; set; }
        [Column(TypeName = "nvarchar(5)")]
        public string State { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }

        public DrawingEquipment Drawing { get; set; }
        public Diagram Parent { get; set; }
        public Shape Shape { get; set; }
        public VisioMap VisioMap { get; set; }
        public WordMap WordMap { get; set; }
        public ICollection<Diagram> Notations { get; set; }
    }
}
