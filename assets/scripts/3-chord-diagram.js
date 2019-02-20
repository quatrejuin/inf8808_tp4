"use strict";

/**
 * Fichier permettant de dessiner le diagramme à cordes.
 */


/**
 * Crée les groupes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param arc             Fonction permettant de dessiner les arcs.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://bl.ocks.org/mbostock/4062006
 */
function createGroups(g, data, layout, arc, color, total, formatPercent) {
  /* TODO:
     - Créer les groupes du diagramme qui sont associés aux stations de BIXI fournies.
     - Utiliser un "textPath" pour que les nom de stations suivent la forme des groupes.
     - Tronquer les noms des stations de BIXI qui sont trop longs (Pontiac et Métro Mont-Royal).
     - Afficher un élément "title" lorsqu'un groupe est survolé par la souris.
  */
  let group = g
    .selectAll("g")
    .data(layout.groups)
    .enter()
    .append("g")
    .classed("arcGroup",true)

    let t =group.append("path")
    .attr("id",d => "arc-"+d.index)
    .attr("fill", d => color(d.index))
    .attr("d", arc);

    let innerRadius = arc.innerRadius()()
    group.append("text")
    .attr("fill", "white")
    .attr("font-size","12px")
    .attr("dx","0.6em")
    .attr("dy","1.4em")
    .append("textPath")
    .attr("xlink:href",d => "#arc-"+d.index)
    .style("text-anchor","start") //place the text halfway on the arc
    .text(d => {
      let name = data[d.index].name
      if (name ==  "Pontiac / Gilford")
      {
        name = "Pontiac"
      }
      else if (name == "Métro Mont-Royal (Rivard/Mont-Royal)") 
      {
        name = "Métro Mont-Royal"
      }
      return name
      }
      );

    group.append("svg:title")
    .text(d => {
      let sum = 0
      data[d.index].destinations.forEach(dd=>
        {
          sum+=dd.count
        }
      )
      return data[d.index].name+": "+formatPercent(sum/total)+" des departs"
    });

}

/**
 * Crée les cordes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param path            Fonction permettant de dessiner les cordes.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://beta.observablehq.com/@mbostock/d3-chord-dependency-diagram
 */
function createChords(g, data, layout, path, color, total, formatPercent) {
  /* TODO:
     - Créer les cordes du diagramme avec une opacité de 80%.
     - Afficher un élément "title" lorsqu'une corde est survolée par la souris.
  */
    let group = g
    .selectAll("path.chord")
    .data(layout)
    .enter()
    

    group.append("path")
    .attr("fill", d => color(d.source.index))
    .attr("class","chord")
    .attr("d", path)
    .append("svg:title")
    .html((d,i) => {
      return data[d.source.index].name+" -> "+data[d.target.index].name+" "+formatPercent(d.source.value/total)+" des departs\n"
      +data[d.target.index].name+" -> "+data[d.source.index].name+" "+formatPercent(d.target.value/total)+" des departs"
    });
}

/**
 * Initialise la logique qui doit être réalisée lorsqu'un groupe du diagramme est survolé par la souris.
 *
 * @param g     Le groupe SVG dans lequel le diagramme à cordes est dessiné.
 */
function initializeGroupsHovered(g) {
  /* TODO:
     - Lorsqu'un groupe est survolé par la souris, afficher les cordes entrant et sortant de ce groupe avec une
       opacité de 80%. Toutes les autres cordes doivent être affichées avec une opacité de 10%.
     - Rétablir l'affichage du diagramme par défaut lorsque la souris sort du cercle du diagramme.
  */

g.selectAll(".arcGroup")
 .on("mouseover",function(ad){
    let chords = g.selectAll(".chord")
    chords.each(function(cd)
    {
      if (ad.index!=cd.source.index && ad.index!=cd.target.index)
      {
        d3.select(this).classed("fade", true);
      }
    })
 })
 .on("mouseout",function(d){
  let arcs = g.selectAll(".chord").classed("fade", false)
 })

}
