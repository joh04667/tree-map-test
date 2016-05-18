$(function() {




function getData() {
  console.log('sent reqs');
  var foamtree = new CarrotSearchFoamTree({
    id: "visualization",
    dataObject: {
      groups: [
        { label: "Loading", weight: 1.0 },
        { label: "Loading", weight: 3.0 },
        { label: "Please", weight: 2.0 },
        { label: "Wait", weight: 4.0 }
      ]
    },
    layout: "squarified",
    maxGroupLevelsDrawn: 2,
    maxGroupLabelLevelsDrawn: 1,
    relaxationVisible: true,
    groupSelectionOutlineShadowSize: 1,
    groupSelectionOutlineWidth: 0,
    wireframLabelDrawing: 'never',
    finalCompleteDrawMaxDuration: 1,
    finalIncrementalDrawMaxDuration: 1,
    groupMinDiameter: 0,
    stacking: 'hierarchical',
    rolloutDuration: 0,
    pullbackDuration: 0,

  });
$.get('/data').done(function(response) {
  console.log(response);
  foamtree.set({
    dataObject: { groups: response },
    // relaxationQualityThreshold: Number.MAX_VALUE,
    maxGroupLevelsDrawn: 2,
    maxGroupLabelLevelsDrawn: 1,

    groupBorderWidth: 0
  });
});
}

getData();


});
