class PIBBranch {
    constructor(name) {
        this.name = name;
        this.members = []
    }

    addMember(name, skills) {
        this.members.push(new Member(name, skills))
    }
}

class Member {
    constructor(name, skills) {
        this.name = name;
        this. skills = skills;
    }
}

class BranchService {
    // cannot get API to run without occurance of : GET, 404 (not found) error
    static url = 'https://63532953a9f3f34c374eed30.mockapi.io/:endpoint'
    //original guide API; links but breaks
    //  static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';
    

    static getAllBranches() {
        return $.get(this.url);
    }

    static getBranch(id) {
        return $.get(this.url + `/${id}`);
    }

    static createBranch(branch) {
        return $.post(this.url, branch);
    }

    static updateBranch(branch) {
        return $.ajax({
            url: this.url + `/${branch._id}`,
            dataType: 'json',
            data: JSON.stringify(branch),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteBranch(id) {
        return $.ajax({
            url: this.url + `${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static branches;

    static getAllBranches() {
        BranchService.getAllBranches().then(branches => this.render(branches));
    }

    static createBranch(name) {
        BranchService.createBranch(new Branch(name))
        .then(() => {
            return BranchService.getAllBranches();
        })
        .then((branches) => this.render(branches))
    }

    static deleteBranch(id) {
        BranchService.deleteBranch(id)
        .then(() => {
            return BranchService.getAllBranches();
        })
        .then((branches) => this.render(branches));
    }

    static addSkill(id) {
        for (let branch of this.branches) {
            if (branch._id == id) {
                branch.skills.push(new Skill($(`#${branch._id}-member-name`).val(), $(`#${branch._id}-skill-area`).val()));
                BranchService.updateBranch(branch)
                .then(() => {
                    return BranchService.getAllBranches();
                })
                .then((branches) => this.render(branches));
            }
        }
    }

    static deleteMember(branchId, memberId) {
        for (let branch of this.branches) {
            if(branch._id == branchId) {
                for (let member of branch.members) {
                    if(member._id == memberId) {
                        branch.members.splice(branch.members.indexOf(member), 1);
                        BranchService.updateBranch(branch)
                        .then(() => {
                            return BranchService.getAllBranches();
                        })
                        .then((branches) => this.render(branches));
                    }
                }
            }
        }
    }

    static render(branches) {
        this.branches = branches;
        $('#app').empty();
        for (let branch of branches) {
            $('#app').prepend(
                `<div id="${branch._id}" class="card">
                    <div class="card-header">
                        <h2>${branch.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteBranch('${branch._id}')"> Delete </button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${branch._id}-member-name" class="form-control" placeholder="Member Name"
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${branch._id}-skill-area" class="form-control" placeholder="Member Skills"
                                </div>
                            </div>
                            <button id="${branch._id}-new-member" onClick="DOMManager.addMember('${branch._id}')" class="btn btn-success form-control">ADD</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let member of branch.member) {
                $(`#${branch._id}`).find('.card-body').append(
                    `<p>
                    <span id+"name-${member._id}"><strong>Name: </strong> ${member.name}</span>
                    <span id+"skill-${member._id}"><strong>Name: </strong> ${member.skill}</span>
                    <button class="btn btn-danger" onClick="DOMManager.deleteMember('${branch._id}', '${member._id}')">Delete Member</button>`
                )
            }
        }
    }

}


//this is the code to access the create new branch button, detailed in HTML

$(`#create-new-branch`).on('click', (() => {
    DOMManager.createBranch($(`#new-branch-name`).val());
    $(`#new-branch-name`).val('');
}))

DOMManager.getAllBranches();
//