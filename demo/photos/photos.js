function renderPhotoSet(images, name, date) {
	var grid = images.map(image => `
		<div clickable>
			<div data-url="/flexus/demo/img/${image}"
			style="background-image: url('/flexus/demo/img/${image}')"></div>
		</div>`
	)
	// add few more empty spaces to balance the grid
	grid.push('<div></div><div></div><div></div><div></div><div></div><div></div>')
	return `
		<div indent display1 style="margin-top: 1rem">${name}</div>
		<div indent subhead style="height: 48px;">${date}</div>
		<div class="grid">${grid.join('')}</div>
	`
}


var photoSet1 = [
	'dovolene/kolo1.jpg',
	'dovolene/voda.jpg',
	'dovolene/vransko1.jpg',
	'dovolene/zelnak1.jpg',
	'dovolene/zapad3.jpg',
	'dovolene/cesta1.jpg',
	'dovolene/cesta2.jpg',
	'dovolene/drago.jpg',
	'dovolene/more.jpg',
	'dovolene/petrov.jpg',
	'dovolene/silingrak.jpg',
	'dovolene/stezka.jpg',
	'dovolene/strom.jpg',
	'dovolene/vransko2.jpg',
	'dovolene/vransko3.jpg',
	'dovolene/vransko4.jpg',
	'dovolene/vransko5.jpg',
	'dovolene/vransko6.jpg',
	'dovolene/zapad1.jpg',
	'dovolene/zapad2.jpg',
	'dovolene/praha.jpg',
	'dovolene/zelnak2.jpg',
	'dovolene/zima.jpg',
	'dovolene/kuncice1.jpg',
	'dovolene/kuncice2.jpg',
	'dovolene/lysa.jpg',
]
var photoSet2 = [
	'nexus5/IMG_8754.JPG',
	'nexus5/IMG_8755.JPG',
	'nexus5/IMG_8763.JPG',
	'nexus5/IMG_8765.JPG',
	'nexus5/IMG_8766.JPG',
	'nexus5/IMG_8767.JPG',
	'nexus5/IMG_8768.JPG',
	'nexus5/IMG_8770.JPG',
	'nexus5/IMG_8771.JPG',
	'nexus5/IMG_8773.JPG',
	'nexus5/IMG_8774.JPG',
	'nexus5/IMG_8776.JPG',
	'nexus5/IMG_8777.JPG',
	'nexus5/IMG_8786.JPG',
	'nexus5/IMG_8787.JPG',
]

var $viewGallery = document.querySelector('#gallery')
var $viewPhoto = document.querySelector('#photo')
var $photoImg = document.querySelector('#photo-img')


function openPhoto(url) {
	$photoImg.src = url
	$viewGallery.hide()
	$viewPhoto.show()
}

// show gallery grid, hide details
//hidePhoto()
// render gallery grid		
var $viewGalleryMain = $viewGallery.querySelector('main')
$viewGalleryMain.innerHTML += renderPhotoSet(photoSet1, 'The World', '2016')
$viewGalleryMain.innerHTML += renderPhotoSet(photoSet2, 'Nexus 5 Repair', 'April 28, 2014')

// listen for click events on gallery grid
$viewGalleryMain.addEventListener('click', e => {
	if (e.target.dataset.url) {
		openPhoto(e.target.dataset.url)
	}
})

// <flexus-view> fires 'hide' event when 'arrow-back' icon is clicked.
// Listein to it and show grid gallery afterwards
$viewPhoto.addEventListener('hide', e => {
	$viewGallery.show()
})