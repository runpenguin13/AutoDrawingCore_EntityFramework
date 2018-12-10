using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Shape", Schema = "Drawing")]
    public partial class Shape
    {
        public Shape()
        {
            Diagrams = new HashSet<Diagram>();
            RelationShapes = new HashSet<RelationShape>();
            ChildrenShapes = new HashSet<RelationShape>();
        }

        public int Id { get; set; }
        public int? VisioMapId { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }

        public VisioMap VisioMap { get; set; }
        public ICollection<Diagram> Diagrams { get; set; }
        public ICollection<RelationShape> RelationShapes { get; set; }
        public ICollection<RelationShape> ChildrenShapes { get; set; }
    }
}
